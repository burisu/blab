class CreateCollaborations < ActiveRecord::Migration
  def self.up
    create_table :collaborations do |t|
      t.integer :role_id
      t.integer :movie_id
      t.integer :person_id
      t.date :started_on
      t.date :stopped_on
      t.text :note

      t.timestamps
    end
  end

  def self.down
    drop_table :collaborations
  end
end
