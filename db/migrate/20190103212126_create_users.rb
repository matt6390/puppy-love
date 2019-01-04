class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :f_name
      t.string :l_name
      t.integer :age
      t.integer :gender

      t.timestamps
    end
  end
end
