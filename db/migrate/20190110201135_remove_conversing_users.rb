class RemoveConversingUsers < ActiveRecord::Migration[5.2]
  def change
    drop_table :conversing_users
  end
end
