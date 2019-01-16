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
                            user_id: params[:user_id]
                          )
    if @picture.save
      render json: @picture.as_json
    else
      render json: {errors: @picture.errors.full_messages}, status: :bad_request
    end
  end

  def update
    
  end

  def destroy
    @picture = Picture.find(params[:id])
    @picture.delete
    render json: {message: "Picture deleted"}
  end
end
