class Role < ActiveRecord::Base
  validates_length_of :name, :minimum=>5
  validates_format_of :name, :with=>/^[A-Z]/ 
end
