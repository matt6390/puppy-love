class CreateLikes < ActiveRecord::Migration[5.2]
  def change
    create_table :likes do |t|
      t.integer :swiper_id
      t.integer :swiped_id
      t.integer :status

      t.timestamps
    end
  end
end
