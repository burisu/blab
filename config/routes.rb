Blab::Application.routes.draw do
  resources :collaborations do
    collection do
      get :formize
    end
  end

  resources :roles do
  end

  resources :people do
    collection do
      get :formize
      get :search_for
      get :search_for_default_role
    end
  end

  resources :movies do
    collection do
      get :search
      post :search
    end
  end

  root :to => "movies#index"
end
