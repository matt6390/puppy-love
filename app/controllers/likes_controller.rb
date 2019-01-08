class LikesController < ApplicationController
  def index
    @likes = Like.all 
    render 'index.json.jbuilder'
  end

  def show
    
  end

  def create
    @like = Like.new(
                      swiper_id: current_user.id,
                      swiped_id: params[:swiped_id],
                      status: params[:status]
                    )
    binding.pry
    if @like.save
      render 'show.json.jbuilder'
    else
      render json: {errors: @like.errors.full_messages}, status: :bad_request
    end
  end

  def update
    
  end

  def destroy
    
  end
end
