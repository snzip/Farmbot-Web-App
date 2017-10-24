require 'spec_helper'

describe SessionToken do
  let(:user) { FactoryBot.create(:user) }

  FAKE_TOKEN = [
        { "sub"  => "admin@admin.com",
          "iat"  => 1474570171,
          "jti"  => "c315f378-a318-4d4c-ba06-e4544cbc0621",
          "iss"  => "//localhost:3000",
          "exp"  => 1474915771,
          "mqtt" => "localhost",
          "bot"  => "04b57247-763a-4e99-b1a7-3743fe946a1a" },
        { "typ"  => "JWT",
            "alg"  => "RS256" }
      ]

  it 'initializes' do
    token = SessionToken.new(FAKE_TOKEN)
    expect(token.unencoded).to be_kind_of(Hash)
    actual   = token.unencoded
    expected = FAKE_TOKEN[0]
    expect(actual["sub"]).to eq(expected["sub"])
    expect(actual["iat"]).to eq(expected["iat"])
    expect(actual["jti"]).to eq(expected["jti"])
    expect(actual["iss"]).to eq(expected["iss"])
    expect(actual["exp"]).to eq(expected["exp"])
    expect(actual["mqtt"]).to eq(expected["mqtt"])
    expect(actual["bot"]).to eq(expected["bot"])
  end

  it 'issues a token to a user' do
    SessionToken.issue_to(user, iat: 000, exp: 456, iss: "//lycos.com:9867")
  end

  it "doesn't honor expired tokens" do
    user.update_attributes!(confirmed_at: Time.now)
    token  = SessionToken.issue_to(user, iat: 000, exp: 1, iss: "//lycos.com:9867")
    result = Auth::FromJWT.run(jwt: token.encoded)
    expect(result.success?).to be(false)
    expect(result.errors.values.first.message)
      .to eq(Auth::ReloadToken::BAD_SUB)
  end

  unless ENV["NO_EMAILS"]
    it "doesn't mint tokens for unverified users" do
      user.update_attributes!(confirmed_at: nil)
      expect {
        SessionToken.issue_to(user, iat: 000, exp: 1, iss: "//lycos.com:9867")
      }.to raise_error(Errors::Forbidden)
    end
  else
    puts "Skipping a test because NO_EMAILS was enabled."
  end
end
