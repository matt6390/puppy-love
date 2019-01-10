class CreateConversations < ActiveRecord::Migration[5.2]
  def change
    create_table :conversations do |t|
      t.string :conv_id

      t.timestamps
    end
  end
end
