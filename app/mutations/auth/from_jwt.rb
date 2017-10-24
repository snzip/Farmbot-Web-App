module Auth
  # The API supports a number of authentication strategies (Cookies, Bot token,
  # JWT). This service helps determine which auth strategy to use.
  class FromJWT < Mutations::Command
    required { string :jwt }

    def execute
      token  = SessionToken.decode!(just_the_token)
      claims = token.unencoded
      User.find_by_email_or_id(claims["sub"])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound, User::BadSub
      add_error :jwt, :decode_error, Auth::ReloadToken::BAD_SUB
    end

    def just_the_token
      # Token auth requires the `authorization` header to be in the format of:
      # "Authorization: Bearer <INSERT_TOKEN_HERE>"
      # This helper method strips out the use "Bearer " text from a token, if it
      # managed to sneak in.
      jwt.split(" ").last
    end
  end
end
