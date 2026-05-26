package sagx.app

import android.app.Activity
import android.content.Intent
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import com.getcapacitor.*
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "ScreenCapture")
class ScreenCapturePlugin : Plugin() {

    private lateinit var projectionManager: MediaProjectionManager
    private var mediaProjection: MediaProjection? = null

    private val REQ_CODE = 1001

    override fun load() {
        projectionManager =
            activity.getSystemService(Activity.MEDIA_PROJECTION_SERVICE)
                    as MediaProjectionManager
    }

    @PluginMethod
    fun start(call: PluginCall) {
        val intent = projectionManager.createScreenCaptureIntent()
        startActivityForResult(call, intent, REQ_CODE)
    }

    override fun handleOnActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        super.handleOnActivityResult(requestCode, resultCode, data)

        if (requestCode == REQ_CODE) {
            val ret = JSObject()

            if (resultCode == Activity.RESULT_OK && data != null) {

                mediaProjection =
                    projectionManager.getMediaProjection(resultCode, data)

                ret.put("granted", true)

                notifyListeners("screenResult", ret)

            } else {
                ret.put("granted", false)
                notifyListeners("screenResult", ret)
            }
        }
    }
}