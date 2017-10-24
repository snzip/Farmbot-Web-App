require 'spec_helper'

describe Api::RegimensController do

  include Devise::Test::ControllerHelpers

  describe '#update' do
    let(:user) { FactoryBot.create(:user) }
    let(:sequence) { FactoryBot.create(:sequence, device: user.device) }
    it 'updates an old regimen' do
      sign_in user

      existing = Regimens::Create.run!(device: user.device, name: "x", color: "red", regimen_items: [])
      payload = {
        "id" => existing.id,
        "name" => "something new",
        "color" => "blue",
        "regimen_items" => [
            {
                "time_offset" => 1555500000,
                "sequence_id" => sequence.id
            },
            {
                "time_offset" => 864300000,
                "sequence_id" => sequence.id
            },
            {
                "time_offset" => 950700000,
                "sequence_id" => sequence.id
            }
        ]
        }
      put :update, params: payload
      expect(response.status).to eq(200)
      expect(existing.reload.regimen_items.count).to eq(payload["regimen_items"].length)
      expect(json[:name]).to eq("something new")
      expect(existing.name).to eq("something new")
    end
  end
end
