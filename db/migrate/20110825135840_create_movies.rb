class CreateMovies < ActiveRecord::Migration
  def self.up
    create_table :movies do |t|
      t.string :title
      t.integer :duration
      t.date :first_on

      t.timestamps
    end
  end

  def self.down
    drop_table :movies
  end
end
