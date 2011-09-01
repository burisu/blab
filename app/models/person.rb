class Person < ActiveRecord::Base

  belongs_to :default_role, :class_name=>"Role"
  validates_presence_of :last_name, :first_name

  def label
    "#{self.first_name} #{self.last_name.upcase}"
  end
end
