class ConversationsReset < ActiveRecord::Migration[5.2]
  def change
    remove_column :conversations, :sender_id, :integer
    remove_column :conversations, :receive_id, :integer

  end
end
