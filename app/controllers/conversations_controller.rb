class ConversationsController < ApplicationController
  def index
    @conversations = current_user.conversations

    render json: @conversations.as_json
  end

  def create
    @conversation = Conversation.new()
    
    if @conversation.save
      render json: @conversation.as_json
    else
      render json: {errors: @conversation.errors.full_messages}, status: :bad_request
    end
  end

  def destroy
    
  end
end
