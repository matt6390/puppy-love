class ConversationsController < ApplicationController
  def index
    @conversations = current_user.conversations

    if @conversations.length > 0
      render "index.json.jbuilder"
    else
      render json: {message: "No Conversations"}, status: :bad_request
    end
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
