class AddPreferenceToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :preference, :integer
  end
end
