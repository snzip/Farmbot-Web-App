require 'spec_helper'

describe Api::SequencesController do
  include Devise::Test::ControllerHelpers
  let(:nodes) { sequence_body_for(user) }

  describe '#update' do

    let(:user) { FactoryBot.create(:user) }

    it 'refreshes sequence dependencies on update' do
      SequenceDependency.destroy_all
      old_count = SequenceDependency.count
      sign_in user
      sequence = FactoryBot.create(:sequence, device: user.device)
      input = { id: sequence.id,
                sequence: { name: "Scare Birds",
                            body: nodes } }
      patch :update,
            params: {id: sequence.id },
            body: input.to_json,
            as: :json
      expect(response.status).to eq(200)
      new_count = SequenceDependency.count
      expect(old_count < new_count).to be(true)
    end

    it 'updates existing sequences' do
      sign_in user
      sequence = FactoryBot.create(:sequence, device: user.device)
      input = { sequence: { name: "Scare Birds" } }
      params = { id: sequence.id }
      patch :update,
        params: params,
        body: input.to_json,
        format: :json
      expect(response.status).to eq(200)
      sequence.reload
      expect(sequence.name).to eq(input[:sequence][:name])
    end
  end
end
