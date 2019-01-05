class User < ApplicationRecord
  has_secure_password
  validates :f_name, presence: true
  validates :l_name, presence: true
  validates :age, presence: true
  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: /@/, message: "Must be a valid email address"}

  def other_genders
    gender
  end

  def friendly_created_at
    created_at.strftime("%e %b %Y %H:%M:%S%p")
  end

  def friendly_updated_at
    updated_at.strftime("%e %b %Y %H:%M:%S%p")
  end
end
