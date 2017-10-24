module Api
  class LogsController < Api::AbstractController
    include Skylight::Helpers

    # This is one of the "oddball" endpoints for the FarmBot API.
    # It is unique because it allows batch creation of logs.
    # When creating in batches, it is a "best effort" approach.
    # If some logs fail to save, they will fail silently.
    # As a matter of policy, not all log types are stored in the DB.
    def create
      case raw_json
      when Array then handle_many_logs
      when Hash  then handle_single_log
      else; sorry "Post a JSON array or object.", 422
      end
    end

    instrument_method
    def index
      render json: current_device.limited_log_list
    end

    # Clears out *all* logs.
    def destroy
      render json: current_device.logs.destroy_all && ""
    end

private

    def handle_many_logs
      mutate Logs::BatchCreate.run(device: current_device, logs: raw_json)
    end

    def handle_single_log
      outcome = new_log(raw_json)
      if outcome.success?
        outcome.result.save!
        maybe_deliver(outcome.result)
      end
      mutate outcome
    end

    def new_log(input)
      Logs::Create.run(input, device: current_device)
    end

    def maybe_deliver(log_or_logs)
      LogDispatch.delay.deliver(current_device, log_or_logs)
    end
  end
end
