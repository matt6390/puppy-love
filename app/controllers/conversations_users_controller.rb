class ConversationsUsersController < ApplicationController
  def create
    @conversations_user = ConversationsUser.new(
                                                user_id: params[:user_id],
                                                conversation_id: params[:conversation_id]
                                                )
    if @conversations_user.save
      render json: @conversations_user.as_json
    else
      render json: {errors: @conversations_user.errors.full_messages}, status: :bad_request
    end
  end
end
