class Collaboration < ActiveRecord::Base
  belongs_to :movie
  belongs_to :role
  belongs_to :person
end
