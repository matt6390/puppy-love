class ApplicationController < ActionController::Base
  include Knock::Authenticable
  protect_from_forgery with: :null_session
end
