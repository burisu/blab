class CreatePeople < ActiveRecord::Migration
  def self.up
    create_table :people do |t|
      t.string :type
      t.string :last_name
      t.string :first_name
      t.string :surname
      t.date :born_on
      t.date :dead_on

      t.timestamps
    end
  end

  def self.down
    drop_table :people
  end
end
