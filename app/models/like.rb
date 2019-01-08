class Like < ApplicationRecord
  validates :swiper_id, presence: true
  validates :swiped_id, presence: true
  validates :status, presence: true

  belongs_to :user, through: :swiped_id
  belongs_to :user, through: :swiper_id
end
