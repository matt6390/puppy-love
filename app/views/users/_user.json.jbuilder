json.id user.id
json.f_name user.f_name
json.l_name user.l_name
json.age user.age
json.zip user.zip
json.gender user.gender
json.email user.email
json.preference user.preference
if user.pictures
  json.pictures user.pictures do |picture|
    json.id picture.id
    json.url picture.url
    json.profile_status picture.profile_status
  end
end
json.created_at user.friendly_created_at
json.updated_at user.friendly_updated_at