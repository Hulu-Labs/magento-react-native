package com.magento_mobile_app;

import com.facebook.react.ReactActivity;
import com.hulupaycorern.HulupayCoreRnModule;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "magento_mobile_app";
  }
   @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    HulupayCoreRnModule.initializeHover(this.getApplicationContext());
  }
}
