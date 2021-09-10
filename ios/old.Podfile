require_relative '../node_modules/react-native/scripts/react_native_pods'
require_relative '../node_modules/@react-native-community/cli-platform-ios/native_modules'
require_relative '../node_modules/react-native-unimodules/cocoapods.rb'
require_relative '../node_modules/react-native-unimodules/cocoapods.rb' 

use_unimodules!(modules_paths: ['../node_modules'])

# platform :ios, '10.0'
platform :ios, '11.0'

target 'DCGymAppFrontend' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    # to enable hermes on iOS, change `false` to `true` and then install pods
    :hermes_enabled => false
  )

  pod 'RNVectorIcons', :path => '../node_modules/react-native-vector-icons'

  pod 'react-native-safe-area-context', :path => '../node_modules/react-native-safe-area-context'

  pod 'react-native-webview', :path => '../node_modules/react-native-webview'

  pod 'react-native-encrypted-storage', :path => '../node_modules/react-native-encrypted-storage'

  pod 'RNSVG', :path => '../node_modules/react-native-svg'

  # pod 'react-native-vlc-media-player', :path => '../node_modules/react-native-vlc-media-player'

  target 'DCGymAppFrontendTests' do
    use_unimodules!
    inherit! :complete
    # Pods for testing
  end

  # Enables Flipper.
  #
  # Note that if you have use_frameworks! enabled, Flipper will not work and
  # you should disable the next line.
  use_flipper!()

  post_install do |installer|
    react_native_post_install(installer)
  end
end
