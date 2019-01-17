class PicturesController < ApplicationController
  def index
    
  end

  def show
    @pictures = User.find(params[:id]).pictures
    render json: @pictures.as_json
  end

  def create 
    @picture = Picture.new(
                            url: params[:url],
                            user_id: params[:user_id],
                            profile_status: params[:profile_status]
                          )
    if @picture.save
      render json: @picture.as_json
    else
      render json: {errors: @picture.errors.full_messages}, status: :bad_request
    end
  end

  def update
    @pictures = current_user.pictures.where("id = ? OR profile_status = ?", params[:id], true)

    # makes sure that there are at least 2 pictures to be 'swapped'
    if @pictures.length == 2
      # swap profile_status for both pics
      @pictures.each do |picture|
        if picture.profile_status == true
          picture.profile_status = false
        else
          picture.profile_status = true
        end
      end
      # save the pics
      @pictures.each do |picture|
        if picture.save
          # render json: {message: "Profile Picture Updated"}
        else 
          render json: {errors: picture.errors.full_messages}, status: :bad_request
        end
      end
    # If only one pic is returned by the first line, lets the user know
    else  
      render json: {message: "Already your Profile Pic"}
    end
  end

  def destroy
    @picture = Picture.find(params[:id])
    @picture.delete
    render json: {message: "Picture deleted"}
  end
end
