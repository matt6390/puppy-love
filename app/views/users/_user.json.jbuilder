json.id user.id
json.f_name user.f_name
json.l_name user.l_name
json.age user.age
json.gender user.gender
json.email user.email
json.preference user.preference
json.pictures user.pictures do |picture|
  json.url picture.url
end
json.created_at user.friendly_created_at
json.updated_at user.friendly_updated_at