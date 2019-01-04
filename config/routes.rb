Rails.application.routes.draw do
  post 'user_token' => 'user_token#create'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get "/users" => 'users#index'
  get "/users/:id" => 'users#show'
  post "/users" => 'users#create'
  patch "/users/:id" => 'users#update'
  delete "/users/:id" => 'users#destroy'

  get "/likes" => 'likes#index'
  get "/likes/:id" => 'likes#show'
  post "/likes" => 'likes#create'
  patch "/likes/:id" => 'likes#update'
  delete "/likes/:id" => 'likes#destroy'
end
