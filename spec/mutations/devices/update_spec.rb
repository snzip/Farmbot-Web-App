require 'spec_helper'

describe Devices::Update do
    let(:user) { FactoryBot.create(:user) }
    let(:device) { user.device }


  it 'updates an existing device' do
    previous_name = device.name
    previous_webcam_url = device.webcam_url
    p = { last_saw_mq: Time.now.utc, name:  Haikunator.haikunate(1000) }
    Devices::Update.run!({device: device}, p)
    device.reload
    expect(device.name).to eq(p[:name])
    expect(device.last_saw_mq.hour).to eq(p[:last_saw_mq].hour)
    expect(device.last_saw_mq.min).to eq(p[:last_saw_mq].min)
  end
end
