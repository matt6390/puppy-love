User.create!([
  {f_name: "Matthew", l_name: "Stone", age: 21, zip: 60025, gender: 0, preference: 0, password: 'password', password_confirmation: 'password', email: "matthew@gmail.com"},
  {f_name: Faker::Name.first_name, l_name: Faker::Name.last_name, age: 21, zip: 60025, gender: 1, preference: 0, password: 'password', password_confirmation: 'password', email: Faker::Internet.free_email}
])
