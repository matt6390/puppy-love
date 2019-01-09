class LikesController < ApplicationController
  def index
    @likes = Like.all.where("swiped_id = ? OR swiper_id = ?", current_user.id, current_user.id ) 
    render 'index.json.jbuilder'
  end

  def show
    
  end

  def create
    #if another user has already liked you
    if Like.find_by(swiper_id: params[:swiped_id], swiped_id: current_user.id, status: 1)
      @like = Like.find_by(swiper_id: params[:swiped_id], swiped_id: current_user.id, status: 1)
      if params[:status] == 0
        @like.status = params[:status]
        if @like.save
          render 'show.json.jbuilder'
        else
          render json: {errors: @like.errors.full_messages}, status: :bad_request
        end
      elsif params[:status] == 1
        @like.status = params[:status]
        if @like.save
          render json: {Message: "You've Matched!"}
        else
          render json: {errors: @like.errors.full_messages}, status: :bad_request
        end
      end

    else #when the other user has not Liked you yet
      @like = Like.new(
                        swiper_id: current_user.id,
                        swiped_id: params[:swiped_id],
                        status: params[:status]
                      )
      if @like.save
        render 'show.json.jbuilder'
      else
        render json: {errors: @like.errors.full_messages}, status: :bad_request
      end
    end
  end

  def update
    
  end

  def destroy
    
  end
end
