class UsersController < ApplicationController
  def index
    @users = User.all
    render 'index.json.jbuilder'
  end

  def show
    
  end

  def create
    @user = User.new(
                      f_name: params[:f_name],
                      l_name: params[:l_name],
                      email: params[:email],
                      age: params[:age],
                      gender: params[:gender],
                      password: params[:password],
                      password_confirmation: params[:password_confirmation],
                    )
    if @user.save
      render 'show.json.jbuilder'
    else
      render json: {errors: @user.errors.full_messages}, status: :bad_request
    end
  end

  def update
    
  end

  def destroy
    
  end
end
