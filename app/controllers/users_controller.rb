require 'twilio-ruby'
class UsersController < ApplicationController
  # before_action :authenticate_user

  def index
    #gets all users at the s
    @all_users = User.all.where("id != ?", current_user.id)
    @likes = Like.all.where("swiped_id = ? OR swiper_id = ?", current_user.id, current_user.id )

    #will show all-people if you are bi, but will show your preference if you have one
    if current_user.preference != 2
      @users = @all_users.where("gender = ?", current_user.prefers)
    else
      @users = @all_users
    end

    # If the ydont have a picture, then they wont show up for you. Gotta at least have something
    @users.each do |user|
      if user.pictures == []
        @users = @users - [user]
      end
    end
    
    # Clear out all the people that we don't want to see, also shuffles
    @users = current_user.clear_likes(@users, @likes).shuffle

    render 'index.json.jbuilder'
  end

  def keys
    if current_user
      pet_key = Rails.application.credentials[:PET_KEY].to_s
      google_key = Rails.application.credentials[:GOOGLE_KEY].to_s
      keys = {pet_key: pet_key, google_key: google_key, zip: current_user.zip}
      render json: keys.as_json
    else
      render json: {errors: "Must be logged in"}, status: :bad_request
    end
  end

  def call
    account_sid = Rails.application.credentials[:TWILIO_TEST_ACCOUNT_SID]
    # p account_sid
    auth_token = Rails.application.credentials[:TWILIO_TEST_AUTH_TOKEN]
    # p auth_token
    @client = Twilio::REST::Client.new(account_sid, auth_token)

    call = @client.calls.create(
      to: params[:myNum],
      from: Rails.application.credentials[:PUPPY_PHONE],
      url: "https://c197ed37.ngrok.io/users/connect/#{params[:theirNum]}")

    render json: {message: "Call Incoming"}
  end

  def connect
    # Our response to this request will be an XML document in the "TwiML"
    # format. Our Ruby library provides a helper for generating one
    # of these documents
    response = Twilio::TwiML::VoiceResponse.new do |r|
      r.say(message: 'Now connecting you to the provided shelter. Please wait patiently to be connected')
      # r.dial number: params[:id]
    end

    render xml: response.to_s
  end

  def show
    @user = current_user

    render "show.json.jbuilder"
  end

  def create
    @user = User.new(
                      f_name: params[:f_name],
                      l_name: params[:l_name],
                      email: params[:email],
                      age: params[:age],
                      zip: params[:zip],
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
    @user = User.find(current_user.id)

    @user.f_name = params[:f_name] || @user.f_name
    @user.l_name = params[:l_name] || @user.l_name
    @user.email = params[:email] || @user.email
    @user.age = params[:age] || @user.age
    @user.zip = params[:zip] || @user.zip
    @user.gender = params[:gender] || @user.gender
    @user.preference = params[:preference] || @user.preference
    @user.password = params[:password] || @user.password
    @user.password_confirmation = params[:password_confirmation] || @user.password_confirmation
    # binding.pry

    if @user.save
      render "show.json.jbuilder"
    else
      render json: {errors: @user.errors.full_messages}, status: :unprocessable_entity
    end
  end

  def destroy
    
  end
end
