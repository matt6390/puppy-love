class CreateConversingUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :conversing_users do |t|
      t.integer :user_id
      t.integer :conversation_id

      t.timestamps
    end
  end
end
