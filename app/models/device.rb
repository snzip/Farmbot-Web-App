# Farmbot Device models all data related to an actual FarmBot in the real world.
class Device < ApplicationRecord
  DEFAULT_MAX_LOGS   = 50
  DEFAULT_MAX_IMAGES = 100
  TIMEZONES          = TZInfo::Timezone.all_identifiers
  BAD_TZ             = "%{value} is not a valid timezone"

  has_many  :users
  has_many  :farm_events,  dependent: :destroy
  has_many  :points,       dependent: :destroy
  has_many  :logs,         dependent: :destroy
  has_many  :sequences,    dependent: :destroy
  has_many  :regimens,     dependent: :destroy
  has_many  :peripherals,  dependent: :destroy
  has_many  :tools,        dependent: :destroy
  has_many  :images,       dependent: :destroy
  has_many  :webcam_feeds, dependent: :destroy
  validates :timezone,     inclusion: { in: TIMEZONES,
                                        message: BAD_TZ,
                                        allow_nil: true }
  validates_presence_of :name

  # Give the user back the amount of logs they are allowed to view.
  def limited_log_list
    logs.all.last(max_log_count || DEFAULT_MAX_LOGS)
  end

  def auth_token
    SessionToken.as_json(self.users.first)[:token].encoded
  end
end
