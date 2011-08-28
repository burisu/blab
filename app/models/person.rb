class Person < ActiveRecord::Base

  def label
    "#{self.first_name} #{self.last_name.upcase}"
  end
end
