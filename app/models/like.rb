class Like < ApplicationRecord
  validates :swiper_id, presence: true
  validates :swiped_id, presence: true
  validates :status, presence: true
end
