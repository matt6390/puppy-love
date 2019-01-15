Rails.application.routes.draw do
  post 'user_token' => 'user_token#create'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get "/users" => 'users#index'
  get "/users/:id" => 'users#show'
  post "/users" => 'users#create'
  patch "/users/:id" => 'users#update'
  delete "/users/:id" => 'users#destroy'

  get "/pictures" => 'pictures#index'
  get "/pictures/:id" => 'pictures#show'
  post "/pictures" => 'pictures#create'
  patch "/pictures/:id" => 'pictures#update'
  delete "/pictures/:id" => 'pictures#destroy'

  get "/likes" => 'likes#index'
  get "/likes/:id" => 'likes#show'
  post "/likes" => 'likes#create'
  patch "/likes/:id" => 'likes#update'
  delete "/likes/:id" => 'likes#destroy'

  get "/conversations" => 'conversations#index'
  get "/conversations/:id" => 'conversations#show'
  post "/conversations" => 'conversations#create'
  patch "/conversations/:id" => 'conversations#update'
  delete "/conversations/:id" => 'conversations#destroy'

  get "/conversations_users" => 'conversations_users#index'
  get "/conversations_users/:id" => 'conversations_users#show'
  post "/conversations_users" => 'conversations_users#create'
  patch "/conversations_users/:id" => 'conversations_users#update'
  delete "/conversations_users/:id" => 'conversations_users#destroy'
end
