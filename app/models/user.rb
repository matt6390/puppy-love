class User < ApplicationRecord
  has_secure_password
  validates :f_name, presence: true
  validates :l_name, presence: true
  validates :age, presence: true
  validates :gender, presence: true
  validates :email, presence: true, uniqueness: true
  validates :email, format: { with: /@/, message: "Must be a valid email address"}

  #this method is meant to clear out amyone you have liked, disliked, or has disliked you
  def clear_likes(people, likes)
    new_arr = people
    likes.each do |like|
      #if I DIDN'T like someone, they are removed
      if like.swiper_id == id && like.status == 0
        new_arr.each do |person|
          if person.id == like.swiped_id
           p new_arr.slice(new_arr.index(person), 1)
           p new_arr.ids
          end
        end
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
