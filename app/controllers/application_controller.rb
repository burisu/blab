class ApplicationController < ActionController::Base
  protect_from_forgery

  if Rails.env == "development"
    require_dependency "vendor/ogems/formize/lib/formize.rb"
    require_dependency "vendor/ogems/formize/lib/formize/definition.rb"
    require_dependency "vendor/ogems/formize/lib/formize/definition/form.rb"
    require_dependency "vendor/ogems/formize/lib/formize/definition/form_element.rb"
    require_dependency "vendor/ogems/formize/lib/formize/definition/field_set.rb"
    require_dependency "vendor/ogems/formize/lib/formize/definition/field.rb"
    require_dependency "vendor/ogems/formize/lib/formize/generator.rb"
    require_dependency "vendor/ogems/formize/lib/formize/form_helper.rb"
    require_dependency "vendor/ogems/formize/lib/formize/action_pack.rb"
    for js in Dir.glob("vendor/ogems/formize/lib/assets/javascripts/*.js")
      FileUtils.cp(js, "public/javascripts/#{js.split(/[\/\\]+/)[-1]}")
    end
    for js in Dir.glob("vendor/ogems/formize/lib/assets/stylesheets/*.js")
      FileUtils.cp(js, "public/stylesheets/#{js.split(/[\/\\]+/)[-1]}")
    end
  end

end
