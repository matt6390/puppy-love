class ChangeConversations < ActiveRecord::Migration[5.2]
  def change
    remove_column :conversations, :user_id, :integer
    remove_column :conversations, :conv_id, :integer

    add_column :conversations, :sender_id, :integer
    add_column :conversations, :receive_id, :integer
  end
end
