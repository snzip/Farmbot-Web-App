module Api
  class TokensController < Api::AbstractController
    include Skylight::Helpers
    skip_before_action :authenticate_user!, only: :create
    skip_before_action :check_fbos_version, only: :create
    CREDS        = Auth::CreateTokenFromCredentials
    NO_CREDS     = Auth::CreateToken
    NO_USER_ATTR = "API requets need a `user` attribute that is a JSON object."

    # Give you the same token, but reloads all claims except `exp`
    def show
      mutate Auth::ReloadToken.run(jwt: request.headers["Authorization"])
    end

    instrument_method
    def create
      if_properly_formatted do |auth_params|
        klass = (auth_params[:credentials]) ? CREDS : NO_CREDS
        mutate klass
          .run(auth_params)
          .tap { |result| maybe_halt_login(result) }
          .tap { |result| mark_as_seen(result.result[:user].device) if result.result }
      end
    end

    private

    # Don't proceed with login if they need to sign the EULA
    instrument_method
    def maybe_halt_login(result)
      result.result[:user].try(:require_consent!) if result.success?
    end

    instrument_method
    def guess_aud_claim
      when_farmbot_os { return AbstractJwtToken::BOT_AUD }
      return AbstractJwtToken::HUMAN_AUD if xhr?
      AbstractJwtToken::UNKNOWN_AUD
    end

    instrument_method
    def xhr? # I only wrote this because `request.xhr?` refused to be stubbed
      request.xhr?
    end

    instrument_method
    def if_properly_formatted
      user = params.as_json.deep_symbolize_keys.fetch(:user, {})
      # If data handling for this method gets any more complicated,
      # extract into a mutation.
      if(user.is_a?(Hash))
        yield({ email:          user.fetch(:email, "").downcase,
                password:       user[:password],
                credentials:    user[:credentials],
                agree_to_terms: !!user[:agree_to_terms],
                host:           $API_URL,
                aud:            guess_aud_claim })
      else
        render json: {error: NO_USER_ATTR}, status: 422
      end
    end
  end
end
