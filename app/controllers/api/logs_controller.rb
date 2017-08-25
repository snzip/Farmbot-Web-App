module Api
  class LogsController < Api::AbstractController

    def create
    case raw_json
    when Array
        logs = Log
                 .create(raw_json.last(current_device.max_log_count)
                                 .map    { |i| new_log(i) }
                                 .select { |i| i.success? } # <= Ignore rejects
                                 .map    { |i| i.result }
                                 .reject do |i|
                                   # Don't save jokes or debug info:
                                   t = i.meta["type"]
                                   ["fun", "debug"].include?(t)
                                 end
                                 .map    { |i| i.as_json })
                 .tap { |i| maybe_deliver(i) }
        render json: logs
      when Hash
        outcome = new_log(raw_json)
        if outcome.success?
          outcome.result.save!
          maybe_deliver(outcome.result)
        end
        return mutate outcome
      else
        sorry "Post a JSON array or object.", 422
      end
    end

    def index
      render json: current_device.limited_log_list
    end

    def destroy
      render json: current_device.logs.destroy_all && ""
    end

private

    def new_log(input)
      Logs::Create.run(input, device: current_device)
    end

    def maybe_deliver(log_or_logs)
      LogDispatch.deliver(current_device, log_or_logs)
    end
  end
end
