class User < ApplicationRecord
  has_secure_password
  validates :f_name, presence: true
  validates :l_name, presence: true
  validates :age, presence: true
  validates :zip, presence: true, numericality: { only_integer: true }
  validates :gender, presence: true
  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: /@/, message: "Must be a valid email address"}

  has_and_belongs_to_many :conversations
  has_many :pictures

  #this method is meant to clear out amyone you have liked, disliked, or has disliked you
  def clear_likes(people, likes)
    dont_want = []
    likes.each do |like|
      #if I DISLIKED like someone, they are added to the array that will be removed
      if like.swiper_id == id && like.status == 0
        dont_want << like.swiped_id
      #if I LIKED someone, they are added to the array to be removed
      elsif like.swiper_id == id && like.status == 1
        dont_want << like.swiped_id
      #if someone DISLIKED me, then they will not show up for me
      elsif like.swiped_id == id && like.status == 0
        dont_want << like.swiper_id
      end
    end
    return self.remove_people(people, dont_want)
    # return people
  end

  #removes any profiles that we do not want to see
  def remove_people(people, dont_want)
    new_arr = []
    #if a persons id is not in the dont_want, then they are returned by this method
    people.each do |person|
      if dont_want.include?(person.id)
      else
        new_arr << person
      end
    end
    return new_arr
  end

  #Returns the desired gender based upon your gender and preference
  def prefers
    if preference == 0
      return self.other_gender(gender)
    elsif preference == 1
      return gender
    end
  end

  #this is used to find the other gender
  def other_gender(gender) 
    if gender == 0
      return 1
    elsif gender == 1
      return 0
    end
  end

  def friendly_created_at
    created_at.strftime("%e %b %Y %H:%M:%S%p")
  end

  def friendly_updated_at
    updated_at.strftime("%e %b %Y %H:%M:%S%p")
  end
end
