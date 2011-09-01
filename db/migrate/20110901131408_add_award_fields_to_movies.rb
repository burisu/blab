class AddAwardFieldsToMovies < ActiveRecord::Migration
  def self.up
    add_column :movies, :awarded, :boolean
    add_column :movies, :several_times_awarded, :boolean
    add_column :movies, :awards_count, :integer
  end

  def self.down
    remove_column :movies, :awards_count
    remove_column :movies, :several_times_awarded
    remove_column :movies, :awarded
  end
end
