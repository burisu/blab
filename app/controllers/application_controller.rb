class ApplicationController < ActionController::Base
  protect_from_forgery
  layout :dialog

  def dialog
    return (request.xhr? ? false : "application")
  end

  if Rails.env == "development"
    Formize.compile!
    lib_dir = "vendor/ogems/formize/lib/formize"
    for dependency in Dir.glob("#{lib_dir}/**/*.rb")
      require_dependency lib_dir+dependency.split(lib_dir)[-1][0..-4]
    end
    assets_dir = "vendor/ogems/formize/lib/assets"
    for js in Dir.glob("#{assets_dir}/**/*.*")
      FileUtils.cp(js, "public#{js.split(assets_dir)[-1]}")
    end 
    lib_dir = "vendor/ogems/combo_box/lib/combo_box"
    for dependency in Dir.glob("#{lib_dir}/**/*.rb")
      require_dependency lib_dir+dependency.split(lib_dir)[-1][0..-4]
    end
    assets_dir = "vendor/ogems/combo_box/lib/assets"
    for js in Dir.glob("#{assets_dir}/**/*.*")
      FileUtils.cp(js, "public#{js.split(assets_dir)[-1]}")
    end 
  end

end
