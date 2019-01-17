class AddProfileStatusToPictures < ActiveRecord::Migration[5.2]
  def change
    add_column :pictures, :profile_status, :boolean
  end
end
