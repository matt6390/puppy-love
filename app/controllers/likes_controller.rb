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
      #If I did not like the person who liked me, update the Like so that we never see each other
      if params[:status] == 0
        @like.status = params[:status]
        if @like.save
          render 'show.json.jbuilder'
        else
          render json: {errors: @like.errors.full_messages}, status: :bad_request
        end
        #If I did Like the person, then we will be matched
      elsif params[:status] == 1
        # Changes the Likes status to 0, making them 'dislike' the other person, but this prevents the 2 users from showing up for each other
        @like.status = params[:status]
        # render json: {message: "You've Been Matched"}
        render json: @like.as_json
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
