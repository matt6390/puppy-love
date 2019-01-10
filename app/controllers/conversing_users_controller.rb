class ConversingUsersController < ApplicationController
  def create
    @conversing_user = ConversingUser.new(
                                          user_id: params[:user_id],
                                          conversation_id: params[:conversation_id]
                                          )
    if @conversing_user.save
      render json: @conversing_user.as_json
    else
      render json: {errors: @conversing_user.errors.full_messages}, status: :bad_request
    end
  end
end
