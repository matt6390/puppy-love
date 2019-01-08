class UsersController < ApplicationController
  def index
    #gets all users at the s
    @all_users = User.all.where("id != ?", current_user.id)
    @likes = Like.all.where("swiped_id = ? OR swiper_id = ?", current_user.id, current_user.id )
    # binding.pry
    @all_users = current_user.clear_likes(@all_users, @likes)
    #will show all-people if you are bi, but will show your preference if you have one
    if current_user.preference != 2
      @users = @all_users.where("gender = ?", current_user.prefers)
    else
      @users = @all_users
    end
    
    @users = @users.shuffle

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
                      preference: params[:preference],
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
